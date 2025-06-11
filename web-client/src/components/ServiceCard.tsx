import { Service } from '@/types/types'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({
  service
}: ServiceCardProps) {  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="card-title text-lg font-semibold mb-2">{service.name}</h3>
            <p className="text-base-content/80 text-sm line-clamp-2">{service.description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="badge badge-primary badge-lg font-semibold">
              €{service.price.toFixed(2)}
            </div>
            {service.duration && (
              <div className="badge badge-ghost gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration} min
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
