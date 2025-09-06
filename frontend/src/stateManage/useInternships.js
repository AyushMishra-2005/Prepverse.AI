import { create } from 'zustand';

const useInternships = create((set) => ({
  internshipsData: [],
  setInternshipsData: (internshipsData) => set({internshipsData}),

}))

export default useInternships;






























