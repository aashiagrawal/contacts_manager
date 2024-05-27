'use client'
import ConnectionTable from "@/components/frontend/ConnectionTable";
import PageHeader from "@/components/frontend/PageHeader";
import {useState, useEffect} from 'react'
import { Contact } from "./types/contact";

export default function Home() {

  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await fetch('/api/contacts');
            const result = await response.json();
            console.log('Fetched contacts:', result); // Log fetched contacts

            setContacts(result);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        };
    
        fetchData();
  }, [])


  return (
    <div className="flex justify-center">
      <div className="w-4/5">
        <PageHeader numRows={contacts.length}/>
        <ConnectionTable data={contacts}/>
      </div>
    </div>
  )
}