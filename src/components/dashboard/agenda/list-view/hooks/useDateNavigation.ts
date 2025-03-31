
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

export function useDateNavigation(initialFilterValue: string = "thisWeek") {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Initialize with the current week
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: getWeekStart(today), 
    to: getWeekEnd(today)
  });
  
  const [filterValue, setFilterValue] = useState<string>(initialFilterValue);
  const [showPastPresets, setShowPastPresets] = useState(false);
  const [showUpcomingPresets, setShowUpcomingPresets] = useState(false);
  
  // Handle from date selection
  const handleFromDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Update the date range - Using a direct object instead of a function
    const to = dateRange?.to || date;
    
    // If the selected from date is after the to date, set to date to the from date
    if (to && date > to) {
      setDateRange({ from: date, to: date });
    } else {
      setDateRange({ from: date, to: to });
    }
  };
  
  // Handle till date selection
  const handleTillDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Update the date range - Using a direct object instead of a function
    const from = dateRange?.from || new Date();
    
    // If the selected to date is before the from date, set from date to the to date
    if (date < from) {
      setDateRange({ from: date, to: date });
    } else {
      setDateRange({ from: from, to: date });
    }
  };
  
  // Toggle preset sections
  const handleFilterChange = (value: string) => {
    // If clicking the current filter, don't change anything
    if (value === filterValue) {
      return;
    }
    
    setFilterValue(value);
    
    // Show appropriate preset options based on filter selection
    if (value === "past") {
      setShowPastPresets(true);
      setShowUpcomingPresets(false);
    } else if (value === "upcoming") {
      setShowPastPresets(false);
      setShowUpcomingPresets(true);
    } else {
      setShowPastPresets(false);
      setShowUpcomingPresets(false);
      
      // For "today", automatically update date range
      if (value === "today") {
        const today = new Date();
        setDateRange({ from: today, to: today });
      } else if (value === "thisWeek") {
        // For thisWeek, set date range to current week
        const today = new Date();
        setDateRange({ from: getWeekStart(today), to: getWeekEnd(today) });
      }
    }
  };
  
  // Update date range when preset is clicked
  const handlePresetClick = (presetValue: string) => {
    const today = new Date();
    
    switch (presetValue) {
      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      }
      case "lastWeek": {
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - today.getDay() - 6);
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - today.getDay());
        setDateRange({ from: lastMonday, to: lastSunday });
        break;
      }
      case "thisMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRange({ from: firstDay, to: lastDay });
        break;
      }
      case "lastMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateRange({ from: firstDay, to: lastDay });
        break;
      }
      case "last30Days": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateRange({ from: thirtyDaysAgo, to: today });
        break;
      }
      case "tomorrow": {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDateRange({ from: tomorrow, to: tomorrow });
        break;
      }
      case "thisWeek": {
        setDateRange({ from: getWeekStart(today), to: getWeekEnd(today) });
        break;
      }
      case "nextWeek": {
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() - today.getDay() + 8); // This gets next Monday
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + 6); // This gets next Sunday
        console.log("Next week date range:", { from: nextMonday, to: nextSunday });
        setDateRange({ from: nextMonday, to: nextSunday });
        break;
      }
      case "next30Days": {
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);
        setDateRange({ from: today, to: thirtyDaysLater });
        break;
      }
      case "upcoming": {
        // For upcoming, we want all future events starting from today
        const futureEnd = new Date(today);
        futureEnd.setFullYear(futureEnd.getFullYear() + 100); // Set a far future date
        console.log("Upcoming date range:", { from: today, to: futureEnd });
        setDateRange({ from: today, to: futureEnd });
        break;
      }
    }
    
    // Close the preset menus
    setShowPastPresets(false);
    setShowUpcomingPresets(false);
    
    // Update the filter value
    setFilterValue(presetValue);
  };
  
  // Initialize with thisWeek preset
  useEffect(() => {
    if (!dateRange?.from && !dateRange?.to) {
      handlePresetClick("thisWeek");
    }
  }, []);
  
  // Helper functions for week calculations
  function getWeekStart(date: Date): Date {
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Get Monday
    return monday;
  }
  
  function getWeekEnd(date: Date): Date {
    const sunday = new Date(date);
    const monday = getWeekStart(date);
    sunday.setDate(monday.getDate() + 6); // Get Sunday
    return sunday;
  }
  
  return {
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    filterValue,
    setFilterValue,
    showPastPresets,
    showUpcomingPresets,
    handleFromDateSelect,
    handleTillDateSelect,
    handleFilterChange,
    handlePresetClick
  };
}
