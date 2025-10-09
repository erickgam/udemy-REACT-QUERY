import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");
  
  const selectStaff = useCallback((staff: Staff[]) => {
    if(filter === "all") return staff
    
    return filterByTreatment(staff, filter)
  }, [filter])

  const { data: staff = [] } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectStaff
  });

  return { staff, filter, setFilter };
}
