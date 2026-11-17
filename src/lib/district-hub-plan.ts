export type RolloutPhase = 1 | 2 | 3;

// Confirmation describes the location, not approval of its proposed rollout phase.
export function districtHubStatus(id: string) {
  const confirmed = id === "dhaka";
  return {
    confirmed,
    label: confirmed ? "Confirmed flagship" : "Proposed hub",
    pinLabel: confirmed ? "C" : "P",
  };
}

export interface DistrictHubPlan {
  id: string;
  name: string;
  query: string;
  phase: RolloutPhase;
}

export interface DistrictHubLocation extends DistrictHubPlan {
  lat: number;
  lng: number;
  geocodedAt: string;
}

export const PHASE_INFO: Record<
  RolloutPhase,
  { title: string; timing: string; description: string }
> = {
  1: {
    title: "Pilot development",
    timing: "Phase 1",
    description:
      "Six illustrative division-level pilot candidates, including the confirmed Dhaka flagship.",
  },
  2: {
    title: "Regional expansion",
    timing: "Phase 2",
    description: "Eighteen illustrative candidates for the next regional expansion stage.",
  },
  3: {
    title: "National network",
    timing: "Phase 3",
    description: "Forty illustrative candidates completing one proposed hub in every district.",
  },
};

// Proposed planning scenario only: except for the Dhaka flagship address, neither venues nor rollout assignments are confirmed.
export const DISTRICT_HUB_PLAN: readonly DistrictHubPlan[] = [
  { id: "bagerhat", name: "Bagerhat", query: "Bagerhat District, Bangladesh", phase: 3 },
  { id: "bandarban", name: "Bandarban", query: "Bandarban District, Bangladesh", phase: 3 },
  { id: "barguna", name: "Barguna", query: "Barguna District, Bangladesh", phase: 3 },
  { id: "barishal", name: "Barishal", query: "Barishal District, Bangladesh", phase: 1 },
  { id: "bhola", name: "Bhola", query: "Bhola District, Bangladesh", phase: 3 },
  { id: "bogura", name: "Bogura", query: "Bogura District, Bangladesh", phase: 2 },
  {
    id: "brahmanbaria",
    name: "Brahmanbaria",
    query: "Brahmanbaria District, Bangladesh",
    phase: 3,
  },
  { id: "chandpur", name: "Chandpur", query: "Chandpur District, Bangladesh", phase: 3 },
  {
    id: "chapai-nawabganj",
    name: "Chapai Nawabganj",
    query: "Chapai Nawabganj District, Bangladesh",
    phase: 3,
  },
  { id: "chattogram", name: "Chattogram", query: "Chattogram District, Bangladesh", phase: 1 },
  { id: "chuadanga", name: "Chuadanga", query: "Chuadanga District, Bangladesh", phase: 3 },
  { id: "coxs-bazar", name: "Cox’s Bazar", query: "Cox's Bazar District, Bangladesh", phase: 2 },
  { id: "cumilla", name: "Cumilla", query: "Cumilla District, Bangladesh", phase: 2 },
  {
    id: "dhaka",
    name: "Dhaka",
    query: "Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205, Bangladesh",
    phase: 1,
  },
  { id: "dinajpur", name: "Dinajpur", query: "Dinajpur District, Bangladesh", phase: 2 },
  { id: "faridpur", name: "Faridpur", query: "Faridpur District, Bangladesh", phase: 2 },
  { id: "feni", name: "Feni", query: "Feni District, Bangladesh", phase: 2 },
  { id: "gaibandha", name: "Gaibandha", query: "Gaibandha District, Bangladesh", phase: 3 },
  { id: "gazipur", name: "Gazipur", query: "Gazipur District, Bangladesh", phase: 2 },
  { id: "gopalganj", name: "Gopalganj", query: "Gopalganj District, Bangladesh", phase: 3 },
  { id: "habiganj", name: "Habiganj", query: "Habiganj District, Bangladesh", phase: 3 },
  { id: "jamalpur", name: "Jamalpur", query: "Jamalpur District, Bangladesh", phase: 3 },
  { id: "jashore", name: "Jashore", query: "Jashore District, Bangladesh", phase: 2 },
  { id: "jhalokati", name: "Jhalokati", query: "Jhalokati District, Bangladesh", phase: 3 },
  { id: "jhenaidah", name: "Jhenaidah", query: "Jhenaidah District, Bangladesh", phase: 3 },
  { id: "joypurhat", name: "Joypurhat", query: "Joypurhat District, Bangladesh", phase: 3 },
  {
    id: "khagrachhari",
    name: "Khagrachhari",
    query: "Khagrachhari District, Bangladesh",
    phase: 3,
  },
  { id: "khulna", name: "Khulna", query: "Khulna District, Bangladesh", phase: 1 },
  { id: "kishoreganj", name: "Kishoreganj", query: "Kishoreganj District, Bangladesh", phase: 2 },
  { id: "kurigram", name: "Kurigram", query: "Kurigram District, Bangladesh", phase: 3 },
  { id: "kushtia", name: "Kushtia", query: "Kushtia District, Bangladesh", phase: 2 },
  { id: "lakshmipur", name: "Lakshmipur", query: "Lakshmipur District, Bangladesh", phase: 3 },
  { id: "lalmonirhat", name: "Lalmonirhat", query: "Lalmonirhat District, Bangladesh", phase: 3 },
  { id: "madaripur", name: "Madaripur", query: "Madaripur District, Bangladesh", phase: 3 },
  { id: "magura", name: "Magura", query: "Magura District, Bangladesh", phase: 3 },
  { id: "manikganj", name: "Manikganj", query: "Manikganj District, Bangladesh", phase: 3 },
  { id: "meherpur", name: "Meherpur", query: "Meherpur District, Bangladesh", phase: 3 },
  { id: "moulvibazar", name: "Moulvibazar", query: "Moulvibazar District, Bangladesh", phase: 2 },
  { id: "munshiganj", name: "Munshiganj", query: "Munshiganj District, Bangladesh", phase: 3 },
  { id: "mymensingh", name: "Mymensingh", query: "Mymensingh District, Bangladesh", phase: 2 },
  { id: "naogaon", name: "Naogaon", query: "Naogaon District, Bangladesh", phase: 3 },
  { id: "narail", name: "Narail", query: "Narail District, Bangladesh", phase: 3 },
  { id: "narayanganj", name: "Narayanganj", query: "Narayanganj District, Bangladesh", phase: 2 },
  { id: "narsingdi", name: "Narsingdi", query: "Narsingdi District, Bangladesh", phase: 2 },
  { id: "natore", name: "Natore", query: "Natore District, Bangladesh", phase: 3 },
  { id: "netrokona", name: "Netrokona", query: "Netrokona District, Bangladesh", phase: 3 },
  { id: "nilphamari", name: "Nilphamari", query: "Nilphamari District, Bangladesh", phase: 3 },
  { id: "noakhali", name: "Noakhali", query: "Noakhali District, Bangladesh", phase: 2 },
  { id: "pabna", name: "Pabna", query: "Pabna District, Bangladesh", phase: 2 },
  { id: "panchagarh", name: "Panchagarh", query: "Panchagarh District, Bangladesh", phase: 3 },
  { id: "patuakhali", name: "Patuakhali", query: "Patuakhali District, Bangladesh", phase: 3 },
  { id: "pirojpur", name: "Pirojpur", query: "Pirojpur District, Bangladesh", phase: 3 },
  { id: "rajbari", name: "Rajbari", query: "Rajbari District, Bangladesh", phase: 3 },
  { id: "rajshahi", name: "Rajshahi", query: "Rajshahi District, Bangladesh", phase: 1 },
  { id: "rangamati", name: "Rangamati", query: "Rangamati District, Bangladesh", phase: 3 },
  { id: "rangpur", name: "Rangpur", query: "Rangpur District, Bangladesh", phase: 2 },
  { id: "satkhira", name: "Satkhira", query: "Satkhira District, Bangladesh", phase: 3 },
  { id: "shariatpur", name: "Shariatpur", query: "Shariatpur District, Bangladesh", phase: 3 },
  { id: "sherpur", name: "Sherpur", query: "Sherpur District, Bangladesh", phase: 3 },
  { id: "sirajganj", name: "Sirajganj", query: "Sirajganj District, Bangladesh", phase: 3 },
  { id: "sunamganj", name: "Sunamganj", query: "Sunamganj District, Bangladesh", phase: 3 },
  { id: "sylhet", name: "Sylhet", query: "Sylhet District, Bangladesh", phase: 1 },
  { id: "tangail", name: "Tangail", query: "Tangail District, Bangladesh", phase: 2 },
  { id: "thakurgaon", name: "Thakurgaon", query: "Thakurgaon District, Bangladesh", phase: 3 },
];
