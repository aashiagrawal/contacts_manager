'use client'

import { Button } from "../ui/button";
import { AddContactDialog } from "./AddContactDialog";

interface PageHeaderProps {
  numRows: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({ numRows }) => {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-medium leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          All contacts
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center font-medium text-sm text-gray-500">
            {numRows} total contacts
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="sm:ml-3">
          <AddContactDialog/>
        </span>
      </div>
    </div>
  )
}
export default PageHeader