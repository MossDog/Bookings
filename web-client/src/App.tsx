import './App.css';
import Banner from './components/Banner';
import Details from './components/Details';
import ServiceMenu from './components/ServiceMenu';
import Services from './components/Services';
import Title from './components/title';
import WeeklyTimeSlotCarousel from './components/WeeklyTimeSlotCarousel'; // Import your carousel!

export default function App() {
  const myServices = [
    { name: "Men's Haircut", price: "$25" },
    { name: "Beard Trim", price: "$15" },
    { name: "Hair & Beard Combo", price: "$35" },
    { name: "Kids Haircut", price: "$20" },
  ];

  const myCategories = [
    'Featured',
    'Hair',
    'Beard Care & Shave',
    'Packages',
    'Hair Colouring & Highlights',
  ];

  return (
    <div>
      <div>
        <Banner />
      </div>

      <div className="HeaderBlock">
        <Title text="Parrilla Ranelagh" size="lg" />
        <Details 
          rating={4.5}
          reviews={185}
          priceRange="€31 to €50"
          category="Mexican"
        />
      </div>

      <div className="ServicesWidget">
        <Title text="Services" size="md" />
        <ServiceMenu categories={myCategories} />
        <Services services={myServices} />
      </div>

      <div className="WeeklyTimeSlotSection">
        <Title text="Book a Time" size="md" />
        <WeeklyTimeSlotCarousel />s
      </div>
    </div>
  );
}