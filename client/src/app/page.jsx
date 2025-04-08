import HeroSection from "@/components/Hero"; // Use @ if using absolute imports, otherwise use relative path
import Steps from "@/components/Steps";
import Card1 from "@/components/Card1";
import BestBrands from "@/components/BestBrands";
import BestI from "@/components/BestI";
import Feedback from "@/components/Feedback";
import Card2 from "@/components/Card2";
import Footer from "@/components/Footer"


const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <Card1/>
            <Steps />
            <BestBrands />
            <BestI/>
            <Feedback/>
            <Card2/>
            <Footer/>
            {/* Add other sections/components */}
        </div>
    );
};

export default LandingPage;
