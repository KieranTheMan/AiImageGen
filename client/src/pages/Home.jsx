import React, { useState, useEffects } from "react";
import { Loader, Card, FormField } from "../components";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");

  const RenderCards = ({ data, title }) => {
    data?.length > 0 ? (
      data.map((post) => <Card key={post._id} {...post} />)
    ) : (
      <h2 className="mt-5 font-bold text-[#6449ff] text-x1 uppercase">
        {title}
      </h2>
    );
  };

  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Browse though a collection of amazing imaginative images generated by
          AI.
        </p>
      </div>

      <div className="mt-16">
        <FormField />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid, lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-1 gap-3">
              {searchText ? (
                <RenderCards data={[]} title="No search results found" />
              ) : (
                <RenderCards data={[]} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;