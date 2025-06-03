'use client'

import React from 'react';
import LoadingSpinner from 'react-spinners-components';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';

const HeadLines = ({ news }) => {
  // Optional: Flatten the news and deduplicate based on unique slug+category
  const headlines = [];

  Object.entries(news).forEach(([category, articles]) => {
    articles.forEach((article, index) => {
      headlines.push({
        ...article,
        _uniqueKey: `${category}-${article.slug}-${index}`,
        _category: category,
      });
    });
  });

  // Optional deduplication (in case of exact duplicate slug+category)
  const seen = new Set();
  const uniqueHeadlines = headlines.filter((item) => {
    const key = `${item._category}-${item.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="bg-white shadow flex flex-wrap">
      {/* Label */}
      <div className="flex md:w-[170px] w-full bg-[#dddddd] relative after:absolute after:bg-[#dddddd] after:w-[20px] after:left-[160px] after:skew-x-[20deg] after:top-0 after:bottom-0 after:z-30">
        <div className="md:pl-4 w-full py-2 flex items-center gap-x-1">
          <LoadingSpinner type="Ripple" colors={['#800000', '#c80000']} size="30px" />
          <h2 className="text-[#333333] font-semibold text-lg">Headlines</h2>
        </div>
      </div>

      {/* Marquee */}
      <div className="flex md:w-[calc(100%-170px)] w-full">
        <Marquee pauseOnHover>
          {uniqueHeadlines.map((item) => (
            <Link
              key={item._uniqueKey}
              href={`/news/${item.slug}`}
              className="py-3 font-semibold hover:text-[#c80000] pr-12 text-sm whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default HeadLines;
