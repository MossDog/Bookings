import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/types/types"
import { useState } from "react"

interface SellerServicesSetupProps {
  onNewService: (service: Service) => void;
}

export default function SellerServicesSetup({
  onNewService
}: SellerServicesSetupProps) {
  const [services, setServices] = useState<Service[]>([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(10);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);

  const addService = () => {
    const newService = { name, price, duration, description }

    setServices([
      ...services,
      newService
    ]);

    onNewService(newService);
  }


  return (      
      <div className='w-full h-full justify-center flex'>
        <div className='card bg-base-200 h-full w-full shadow-lg'>
          <div className='card-header bg-base-300/50 p-8 border-b border-base-300'>
            <div className="flex items-center gap-4">
              <h2 className='card-title text-3xl font-bold text-base-content'>Services</h2>
              <div className="badge badge-primary badge-lg">{services.length} services</div>
            </div>
            <p className='mt-2 text-base-content/70'>Add the services that your business offers</p>
          </div>

          <div className="card-body w-full h-full p-8">
            <div className="flex w-full h-full gap-8">
              {/* Service Creation Form */}
              <div className="flex flex-col gap-6 w-[450px]">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Service Name</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20" 
                      placeholder="Enter service name..." 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="join">
                      <span className="join-item flex items-center px-3 bg-primary text-primary-content font-medium">€</span>
                      <input 
                        type="number" 
                        className="input input-bordered input-primary join-item w-24 focus:ring-2 focus:ring-primary/20" 
                        value={price} 
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-control flex flex-col w-full">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full textarea-primary min-h-[120px] focus:ring-2 focus:ring-primary/20" 
                    placeholder="Enter a description of the service..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Duration</span>
                    <span className="label-text-alt">Average duration of the service</span>
                  </label>
                  <input 
                    type="time" 
                    className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                </div>

                <button 
                  className="btn btn-primary w-full" 
                  onClick={addService}
                  disabled={!name || !description || !price}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Service
                </button>
              </div>

              {/* Services List */}
              <div className="flex-1 rounded-xl flex flex-col gap-4">
                <div className="bg-base-300/30 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Your Services</h3>
                    <div className="badge badge-primary">{services.length} total</div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {services.length === 0 ? (
                      <div className="text-center py-8 text-base-content/70">
                        <p className="text-lg mb-2">No services added yet</p>
                        <p className="text-sm">Add your first service using the form</p>
                      </div>
                    ) : (
                      services.map((service, idx) => (
                        <ServiceCard key={idx} service={service}/>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
}
