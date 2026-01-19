import React from 'react';
import Title from '../Title';
import NewsCard from './item/NewsCard';
import { base_api_url } from '@/config/config';

const RecentNews = async () => {

    let news = []
    try {
        const res = await fetch(`${base_api_url}/api/recent/news`,{
            next: {
                revalidate: 1
            }
        })
       
        const data = await res.json() 
        news = data.news
    } catch (error) {
        console.log("RecentNews Fetch Error:", error)
    } 


    return (
        <div className='w-full flex flex-col gap-y-[6px] bg-white pt-4'>
            <div className='pl-4'>
                <Title title="Recent News" /> 
            </div>
        <div className='grid grid-cols-1 gap-y-1'>
            {
                news && news.length > 0 && news.map((item,i) => (
                    <NewsCard key={i} item={item} />
                ))
            }

        </div>
            
        </div>
    );
};

export default RecentNews;