import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./lib/prisma";
import { appRoutes } from "./routes";

const app = Fastify();

app.register(cors);
app.register(appRoutes);

const port = 3333;

app
  .listen({
    port,
    host: "0.0.0.0",
  })
  .then(() => console.log(`Server online on ${port} 🟢`));
