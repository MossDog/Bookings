type Service = {
    name: string;
    price: string;
  };
  
  type ServicesProps = {
    services: Service[];
  };
  
  export default function Services({ services }: ServicesProps) {
    return (
      <>
        <div className="services-container">
          {services.map((service, index) => (
            <div key={index} className="service-tile">
              <div className="service-name">{service.name}</div>
              <div className="service-price">{service.price}</div>
            </div>
          ))}
        </div>
  
        <div className="view-all">
          <a href="#">View All Services</a>
        </div>
      </>
    );
  }