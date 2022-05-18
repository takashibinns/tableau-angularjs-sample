/*  Tableau Dashboard object, as returned by REST API   */
export interface TableauDashboard {
    id:string,
    name:string,
    preview: string,
    viewUrlName: string,
    createdAt: Date,
    updatedAt: Date,
    isFavorite: boolean,
    usage: {
      totalViewCount: number
    },
    owner: {
      id: string,
      email: string,
      fullName: string
    },
    workbook: {
      id: string,
      name: string,
      description: string,
      contentUrl: string
    }
  }