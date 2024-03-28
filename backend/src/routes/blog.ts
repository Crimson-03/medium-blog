import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@crimson03/medium-blog";
export const blogRouter = new Hono<{
  Bindings: {
    JWT_SECRET: string;
    DATABASE_URL: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  try {
    if (!jwt) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    c.set("jwtPayload", payload.id);
    await next();
  } catch (error) {
    c.status(403);
    return c.json({
      error: "you are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "inputs not correct",
    });
  }
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("jwtPayload"),
      },
    });
    console.log(c.get("jwtPayload"));

    c.status(200);
    return c.json({
      post,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      error: "Internal Server Error",
    });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "inputs not correct",
    });
  }
  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    c.status(200);
    return c.json({
      post,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      error: "Internal Server Error",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({
      posts,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      error: "Internal Server Error",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({
      post,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      error: "Internal Server Error",
    });
  }
});
