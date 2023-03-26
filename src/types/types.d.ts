export interface Nation {
  id: number
  name: string,
  icons: {
    default: string
    tiny: string
    small: string
    large: string
    // local_large: string // GUI
    // local_tiny: string // GUI
    // local_small: string // GUI
  },
  color: string // 14764062
  tags: string[]
  localization: {
    mark: {
      [ propName: string]: string
    }
  }
}

export interface Nations {
  [ propName: string ]: Nation
}


export interface VehicleType {
  name: string
  icons: {
    default: string
    elite: string
    premium: string
    special: string
    normal: string
  }
  sort_order: 5
  localization: {
    shortmark: {
      [ propName: string]: string
    }
    mark: {
      [ propName: string]: string
    }
  }
}



export interface VehicleTypes {
  [ propName: string ] : VehicleType
}



export interface Vehicle {
  id?: string
  icons: {
    default: string // 214x126
    small: string // 214x126
    medium: string // 435x256
    large: string // 870x512
    contour: string
    contour_alive: string
    contour_dead: string
    // local_small: string // GUI
    // local_contour: string // GUI
    // local_contour_dead: string // GUI
    // local_contour_alive: string // GUI
  }
  level: number
  localization: {
    description: {
      [ propName: string ]: string
    }
    mark: {
      [ propName: string ]: string
    }
    shortmark: {
      [ propName: string ]: string
    }
  }
  name: string
  nation: string
  tags: string[]
}


// export interface VehiclesObject {
//   [ id: number ]: Vehicle
// }
export type Vehicles = Map<string, Vehicle>


