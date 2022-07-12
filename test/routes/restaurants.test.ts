import { test } from "tap";
import { build } from "../helper";

test("Indexing all restaurants routes", async t => {
  const app = await build(t);

  const res = await app.inject({
    url: "/restaurants"
  });

  t.equal(res.payload, []);
});
