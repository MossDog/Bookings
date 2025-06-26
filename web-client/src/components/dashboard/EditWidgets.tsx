import { useState } from 'react'
import EditServices from './edit_widgets/EditServices';
import { ArrowRight, Plus, XIcon } from 'lucide-react';

import { ALL_WIDGETS } from '@/utils/widgetorder';
import { updateWidgetOrder } from '@/utils/seller';
import { toast } from 'sonner';
import EditAbout from './edit_widgets/EditAbout';
import { Seller } from '@/types/types';
import EditFAQ from './edit_widgets/EditFAQ';

interface EditWidgetProps {
    enabledWidgets?: string[];
    seller: Seller;
}

export default function EditWidgets({
    enabledWidgets = [],
    seller
}: EditWidgetProps) {
  const [widgets, setWidgets] = useState<string[]>(enabledWidgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [availableWidgets, setAvailableWidgets] = useState<string[]>(ALL_WIDGETS.filter(widget => !enabledWidgets.includes(widget)))

  const addWidget = async (widget: string) => {
    if(!seller.user_id){
      return;
    }

    const newWidgets = [...widgets, widget];
    
    try {
      await updateWidgetOrder(seller.user_id, newWidgets);
      setWidgets(newWidgets);
      toast.success(`${widget} added!`);
      setAvailableWidgets(ALL_WIDGETS.filter(w => !newWidgets.includes(w)));
    } catch (error){
      console.log("Error adding widgets");
      toast.error("Failed to add widget.");

      setWidgets(widgets);
    }
  }

  const removeWidget = async (widget: string) => {
    if(!seller.user_id){
      return;
    }

    // Calculate the new widgets array without the removed widget
    const newWidgets = widgets.filter(w => w !== widget);
    
  
    try {
      // Update the database with the new array
      await updateWidgetOrder(seller.user_id, newWidgets);
      toast.success(`${widget} widget removed!`);
      setWidgets(newWidgets);
      setAvailableWidgets(ALL_WIDGETS.filter(w => !newWidgets.includes(w)));
    } catch (error){
      console.log("Error removing widget:", error);
      toast.error("Failed to remove widget.");
    }
  }

  return (
    <div className="bg-base-100 rounded-box shadow-lg overflow-hidden lg:col-span-3 flex flex-col">
      <div className="bg-base-200 text-primary-content p-4">
        <h2 className="text-xl font-bold">Edit Widgets</h2>
      </div>
      
      {selectedWidget ? (
        <div className="p-4 flex flex-col flex-1">
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
          
          <div className="flex-1">
            { selectedWidget === "services" && <EditServices />}
            { selectedWidget === "about" && <EditAbout initialAboutUs={seller.about_us || ""} sellerId={seller.user_id}/>}
            { selectedWidget === "faq" && <EditFAQ sellerId={seller.user_id} />}
          </div>
        </div>
      ) : (          <div className="p-4">
          <div className="mb-4">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-primary btn-outline gap-2">
                <Plus size={18} /> 
                Add Widgets
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg">
                {availableWidgets.length > 0 ? (
                  availableWidgets.map(widget => (
                    <li key={widget}>
                      <button onClick={() => {
                        addWidget(widget);
                      }}>
                        <Plus size={16} />
                        {widget.charAt(0).toUpperCase() + widget.slice(1)}
                      </button>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-base-content/50">All widgets enabled</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="grid gap-3">
            {widgets.map(widget => (
              <div 
                key={widget}
                className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
                onClick={() => setSelectedWidget(widget)}
              >
                <div className="card-body py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-base-content">
                        <ArrowRight size={18}/>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">
                          {widget.charAt(0).toUpperCase() + widget.slice(1)} Widget
                        </h3>
                        <p className="text-sm text-base-content/70">
                          Configure your {widget} widget settings
                        </p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-xs btn-ghost text-error hover:bg-error hover:text-error-content gap-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        removeWidget(widget);
                      }}
                    >
                      Remove <XIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {widgets.length === 0 && (
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
