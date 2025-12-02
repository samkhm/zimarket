import React, { useState, useEffect } from 'react'
import Item from '@/components/Item'
import Loader from '@/components/Loader';


export default function Home({ addCart, items, loading}) {

  
    return (
        <>
        
        <div className='h-screen w-screen'>       

            <div className='h-full p-10 flex flex-wrap flex-start gap-3'>
                {loading ? (
                    <div className='w-full flex items-center justify-center'>
                        <Loader />
                    </div>
                    
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <Item key={item.id} item={item} addCart={addCart}/>
                    ))
                ) : (
                    <div className='w-full flex items-center justify-center'>
                        <p>No items found</p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
