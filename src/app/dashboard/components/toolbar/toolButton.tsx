import clsx from "clsx";
import { ReactNode } from "react";

interface Props{
    children: ReactNode
    active?: boolean
    onClick?(): void
}
export default function ToolButton({active, children, onClick}: Props){
    return <div 
        onClick={onClick}
        className={clsx("p-2 ml-1", active ? "bg-muted text-foreground rounded-sm" : "text-foreground bg-transparent")}>
            {children}
        </div>
}