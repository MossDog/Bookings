import { useState } from 'react'

interface EditWidgetProps {
    enabledWidgets?: string[];
}

export default function EditWidgets({
    enabledWidgets = []
}: EditWidgetProps) {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);  
  return (
    <div className="bg-base-100 rounded-box shadow-lg overflow-hidden lg:col-span-3">
      <div className="bg-base-200 text-primary-content p-4">
        <h2 className="text-xl font-bold">Edit Widgets</h2>
      </div>
      
      {selectedWidget ? (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setSelectedWidget(null)}
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">
              Edit {selectedWidget.charAt(0).toUpperCase() + selectedWidget.slice(1)} Widget
            </h3>
          </div>
          {/* Widget edit form will go here */}
          <div className="alert alert-info">
            <span>Widget editing functionality coming soon...</span>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid gap-3">
            {enabledWidgets.map(widget => (
              <div 
                key={widget}
                className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
                onClick={() => setSelectedWidget(widget)}
              >
                <div className="card-body py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold">
                          {widget.charAt(0).toUpperCase() + widget.slice(1)} Widget
                        </h3>
                        <p className="text-sm text-base-content/70">
                          Configure your {widget} widget settings
                        </p>
                      </div>
                    </div>
                    <div className="text-base-content/50">
                      →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {enabledWidgets.length === 0 && (
            <div className="text-center py-8">
              <div className="text-base-content/50 mb-2">No widgets enabled</div>
              <p className="text-sm text-base-content/70">
                Add widgets to configure them here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
