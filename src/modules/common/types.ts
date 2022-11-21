import { City, Country, JobGroup, JobPosition, ProjectType, State } from '~/models/common';

export type CommonState = {
  countries: Country[];
  cities: City[];
  states: State[];
  jobPositions: JobPosition[];
  jobGroups: JobGroup[];
  projectTypes: ProjectType[];
  hiringManagerPositions: JobPosition[];
  hiringManagerProjectTypes: ProjectType[];
};
