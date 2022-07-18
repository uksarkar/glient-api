const fs = require("fs");
const escapeString = require("sql-string-escape");

const restaurantJSON = `https://gist.githubusercontent.com/seahyc/b9ebbe264f8633a1bf167cc6a90d4b57/raw/021d2e0d2c56217bad524119d1c31419b2938505/restaurant_with_menu.json`;
const userJSON = `https://gist.githubusercontent.com/seahyc/de33162db680c3d595e955752178d57d/raw/785007bc91c543f847b87d705499e86e16961379/users_with_purchase_history.json`;

/**
 * get restaurant data
 */
function getJSON(path) {
  return fetch(path).then(response => response.json());
}

/**
 * Handle promise
 * @param {Function} func
 * @param  {...any} args
 * @returns {Promise<[response, error]>}
 */
async function handlePromise(func, ...args) {
  try {
    const res = await func.apply(null, args);
    return [res, null];
  } catch (error) {
    return [null, error];
  }
}

function getRestaurantsTimes(times) {
  try {
    const results = [];

    times.split(",").map(d => {
      const dateArr = d.trim().split("/");
      return dateArr.map(dt => {
        const dateTimeArr = dt.trim().split(" ");
        const days = ["", "Thurs", "Fri", "Sat", "Sun", "Mon", "Weds", "Tues"];

        const openAt = formatProxyDateTime(
          days.indexOf(dateTimeArr[0]),
          formatTime(dateTimeArr[1], dateTimeArr[2])
        );
        const closeAt = formatProxyDateTime(
          days.indexOf(dateTimeArr[0]),
          formatTime(dateTimeArr[4], dateTimeArr[5])
        );

        results.push({
          openAt,
          closeAt
        });
      });
    });

    return results;
  } catch (error) {
    return null;
  }
}

function formatTime(time, post) {
  const timeArr = time?.split(":") || ["00", "00"],
    hn = Number(timeArr[0]),
    h =
      post && post.toLowerCase() === "pm"
        ? String(hn === 12 ? hn : hn + 12)
        : hn === 12
        ? "00"
        : timeArr[0],
    m = timeArr[1];
  return `${h.length < 2 ? "0" : ""}${h}:${
    m ? (m.length < 2 ? "0" + m : m) : "00"
  }`;
}

function formatProxyDateTime(date, time) {
  const d = new Date(
    `1970-01-${String(date).length < 2 ? "0" + date : date}T${time}:00.000Z`
  );
  return d.toISOString();
}

async function generateSqlFromDemoData() {
  const [data, error] = await handlePromise(getJSON, restaurantJSON);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  let restaurants_sql = `INSERT INTO restaurants ("id", "restaurantName", "cashBalance") VALUES `;
  let restaurant_dishes_sql = `INSERT INTO restaurant_dishes ("restaurantId", "dishId", "price") VALUES `;
  let restaurant_times_sql = `INSERT INTO restaurant_times ("restaurantId", "openAt", "closeAt") VALUES `;
  let dishes = [];

  const restaurants_name = data.map((r, i) => {
    const restaurantId = i + 1;
    const isLast = restaurantId === data.length;
    const r_ending = isLast ? ";" : ",";
    const r_times = getRestaurantsTimes(r.openingHours);

    if (!r_times) return;

    r_times.map((t, t_ind) => {
      restaurant_times_sql += `\n(${restaurantId}, '${t.openAt}', '${
        t.closeAt
      }')${isLast && t_ind + 1 === r_times.length ? ";" : ","}`;
    });

    restaurants_sql += `\n(${restaurantId}, ${escapeString(
      r.restaurantName
    )}, ${r.cashBalance})${r_ending}`;

    r.menu.map((d, m_ind) => {
      let dishId = dishes.indexOf(d.dishName) + 1;
      const d_ending = isLast && m_ind + 1 === r.menu.length ? ";" : ",";
      if (!dishId) {
        dishes.push(d.dishName);
        dishId = dishes.length;
      }

      restaurant_dishes_sql += `\n(${restaurantId}, ${dishId}, ${d.price})${d_ending}`;
    });

    return r.restaurantName;
  });

  const [users, err] = await handlePromise(getJSON, userJSON);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  let user_sql = `INSERT INTO users ("id", "name", "cashBalance") VALUES `;
  let transaction_sql = `INSERT INTO transactions ("userId", "restaurantId", "dishId", "transactionAmount", "transactionDate") VALUES `;
  users.map((u, i) => {
    const userId = i + 1;
    const isLast = users.length === userId;
    const u_ending = isLast ? ";" : ",";

    user_sql += `\n(${userId}, ${escapeString(u.name)}, ${
      u.cashBalance
    })${u_ending}`;

    u.purchaseHistory.map((h, p_ind) => {
      const restaurantId = restaurants_name.indexOf(h.restaurantName) + 1;
      const dishId = dishes.indexOf(h.dishName) + 1;
      if (!restaurantId || !dishId) {
        console.error(
          `Restaurant or dish not found with the name of ${h.restaurantName} or ${h.dishName}`
        );
        return;
      }
      const p_ending =
        isLast && p_ind + 1 === u.purchaseHistory.length ? ";" : ",";
      transaction_sql += `\n(${userId}, ${restaurantId}, ${dishId}, ${
        h.transactionAmount
      }, '${new Date(
        escapeString(h.transactionDate)
      ).toISOString()}')${p_ending}`;
    });
  });

  const dish_sql = `INSERT INTO dishes ("id", "dishName") VALUES\n${dishes
    .map((d, d_ind) => `(${d_ind + 1}, ${escapeString(d)})`)
    .join(",\n")}`;

  restaurants_sql = restaurants_sql.endsWith(",")
    ? restaurants_sql.substring(0, restaurants_sql.length - 1) + ";"
    : restaurants_sql;
  restaurant_dishes_sql = restaurant_dishes_sql.endsWith(",")
    ? restaurant_dishes_sql.substring(0, restaurant_dishes_sql.length - 1) + ";"
    : restaurant_dishes_sql;
  restaurant_times_sql = restaurant_times_sql.endsWith(",")
    ? restaurant_times_sql.substring(0, restaurant_times_sql.length - 1) + ";"
    : restaurant_times_sql;
  transaction_sql = transaction_sql.endsWith(",")
    ? transaction_sql.substring(0, transaction_sql.length - 1) + ";"
    : transaction_sql;

  fs.writeFileSync(
    "prisma/seed.sql",
    `/**\nRestaurants data\n*/\n\n${restaurants_sql}\n\n/**\nDish data\n*/\n\n${dish_sql};\n\n/**\nRestaurant Dishes\n*/\n\n${restaurant_dishes_sql}\n/**\nUsers data\n*/\n${user_sql}\n\n/**\ntransactions\n*/\n${transaction_sql}\n\n/**\nRestaurants time data\n*/\n${restaurant_times_sql}\n`,
    function (err) {
      if (err) return console.log(err);
    }
  );
}

generateSqlFromDemoData().then(_ => {
  console.log(`SQL file created.`);
});
