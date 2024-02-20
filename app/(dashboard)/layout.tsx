
interface DashboardLayoutProps {    
    children: React.ReactNode
}
function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <main className="h-full">
            <div className="pl-[60px] h-full">
                <div className="flex gap-x-3 h-full">
                    <div className="h-full flex-1">
                        {/* //TODO: Add Navbar */}
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout