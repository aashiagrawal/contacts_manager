'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { send } from "process"
import { useState } from 'react'

export function AddContactDialog() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  
  const sendPostRequest = async (connections) => {
    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({connections})
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send POST request');
        }
        const data = await response.json()
        console.log("response data: ", data)
        return data;
    } catch (error) {
        console.log("error: ", error)
        throw error
    }
  }

  const handleSaveClick = async () => {
    // Make API call
    const contact = [{
        name: name, 
        bio: description, 
        img_link: "https://avatars.githubusercontent.com/u/45323568?v=4", 
        connection_date: "Connected today"}]
    
    try {
        const result = await sendPostRequest(contact)
        console.log("successfully created new contact")
    } catch (error) {
        console.log("Failed to create new contact")
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-medium">+ Add new contact</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add contact</DialogTitle>
          <DialogDescription>
            Fill in the information for your new contact. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
