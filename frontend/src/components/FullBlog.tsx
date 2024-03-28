import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full max-w-screen-2xl pt-10">
          <div className="col-span-8">
            <div className="text-3xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-4">Post on 2nd December 2023</div>
            <div className="pt-4">{blog.content}</div>
          </div>
          <div className="col-span-4">
            <div className="text-slate-600 text-lg">
                Author
            </div>
            <div className="flex w-full">
              <div className="pr-2 flex flex-col justify-center">
                <Avatar name={blog.author.name} size="big" />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Quisquam, assumenda!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
