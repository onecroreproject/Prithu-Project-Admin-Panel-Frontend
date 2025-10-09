import { useState, useEffect, useMemo, useRef } from "react";
import DatePicker from "react-datepicker";
import { AiOutlineCalendar } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";

export default function UserAnalyticsFilter({ onFilterChange, initialFilters, activeTab }) {
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState(initialFilters.startDate || today);
  const [endDate, setEndDate] = useState(initialFilters.endDate || today);
  const [type, setType] = useState(initialFilters.type || "all");

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.({ startDate, endDate, type });
    }, 300);
    return () => clearTimeout(timer);
  }, [startDate, endDate, type]);

  const handleReset = () => {
    setStartDate(today);
    setEndDate(today);
    setType("all");
    onFilterChange?.({ startDate: today, endDate: today, type: "all" });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Start Date</label>
        <div className="mt-1 flex items-center border rounded-lg px-2 py-1 cursor-pointer">
          <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} maxDate={endDate} dateFormat="yyyy-MM-dd" ref={startDateRef} />
          <AiOutlineCalendar className="ml-2 text-gray-500 cursor-pointer" onClick={() => startDateRef.current?.setOpen(true)} />
        </div>
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">End Date</label>
        <div className="mt-1 flex items-center border rounded-lg px-2 py-1 cursor-pointer">
          <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="yyyy-MM-dd" ref={endDateRef} />
          <AiOutlineCalendar className="ml-2 text-gray-500 cursor-pointer" onClick={() => endDateRef.current?.setOpen(true)} />
        </div>
      </div>

      {/* Type filter */}
      {activeTab !== "following" && activeTab !== "interested" && activeTab !== "nonInterested" && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 px-3 py-2 border rounded-lg">
            <option value="all">All</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      )}

      <div className="flex items-end">
        <button onClick={handleReset} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Reset</button>
      </div>
    </div>
  );
}
