import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketingManager from "@/components/marketing/MarketingManager";

const Marketing = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="py-12">
                <MarketingManager />
            </main>
            <Footer />
        </div>
    );
};

export default Marketing;
