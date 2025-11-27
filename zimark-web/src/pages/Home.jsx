import React, { useState, useEffect } from 'react'
import Item from '@/components/Item'
import API from '@/services/api'
import Loader from '@/components/Loader';
import Header from '@/components/Header';

export default function Home() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getItems = async () => {
        setLoading(true);
        try {
            const res = await API.get("/catalog/getItems");
            setItems(res.data);
            console.log(res.data);
        } catch (error) {
            console.log("Failed to get Items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
        <Header />
        <div className='h-screen w-screen'>       

            <div className='h-full p-10 flex flex-wrap flex-start'>
                {loading ? (
                    <div className='w-full flex items-center justify-center'>
                        <Loader />
                    </div>
                    
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <Item key={item.id} item={item} />
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
