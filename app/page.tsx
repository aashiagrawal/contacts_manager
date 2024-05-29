'use client'
import ConnectionTable from "@/components/frontend/ConnectionTable";
import PageHeader from "@/components/frontend/PageHeader";
import { ModeToggle } from "@/components/frontend/ModeToggle";
import {useState, useEffect} from 'react'
import { Contact } from "./types/contact";
import { Input } from "@/components/ui/input";


export default function Home() {

  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [queryText, setQueryText] = useState("")

  useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await fetch('/api/contacts');
            const result = await response.json();
            setContacts(result);
            setLoading(false);
            console.log("this is results: ", result)
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        };
    
        fetchData();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryText)
      })

      if (!response.ok) {
          console.log("entered error")
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send POST request');
      }
      const data = await response.json()
      setContacts(data)
      console.log("this is 3data: ", data)
    } catch (error) {
        console.log("Failed to create new contact")
    }
  }


  return (
    <div className="flex justify-center">
      <div className="w-4/5">
        <PageHeader numRows={contacts.length}/>
        <form onSubmit={handleSubmit} className="mt-5">
            <Input
              placeholder="Ask AI..."
              value={queryText}
              onChange={(event) =>
                setQueryText(event.target.value)
              }
              className="max-w-sm"
            />
          </form>
        <ConnectionTable data={contacts}/>
      </div>
    </div>
  )
}