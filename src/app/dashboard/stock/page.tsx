/* eslint-disable @typescript-eslint/no-unused-vars */

import {DataTableDemo} from "../dataTable"
import { columns, data } from "./dataColumns"

export default function Page(){
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Stock</div>
            <div>
                <DataTableDemo data={data} columns={columns} id="stock"/>
            </div>
        </div>
    </div>
}