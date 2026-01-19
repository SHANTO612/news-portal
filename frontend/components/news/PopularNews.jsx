import React from 'react';
import Title from '../Title';
import SimpleDetailsNewCard from './item/SimpleDetailsNewCard';
import { base_api_url } from '@/config/config';

const PopularNews = async ({type}) => {

    let popularNews = []
    try {
        const res = await fetch(`${base_api_url}/api/popular/news`,{
            next: {
                revalidate: 1
            }
        })
       
        const data = await res.json()
        popularNews = data.popularNews
    } catch (error) {
        console.log("PopularNews Fetch Error:", error)
    }

    return (
        <div className='w-full pb-8 mt-5'>
            <div className='flex flex-col w-full gap-y-[14px]'>
                <Title title="Popular News" />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 sm:gap-3 lg:gap-x-3'>
            {
                popularNews.length > 0 && popularNews.map((item, i) => <SimpleDetailsNewCard type={type} news={item} key={i} height={230} />
                )
            }

        </div>

            </div>
            
        </div>
    );
};

export default PopularNews;