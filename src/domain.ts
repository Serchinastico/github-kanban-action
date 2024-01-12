export interface Label {
  name: string;
  color: string;
  isDarkColor: boolean;
}

export interface Issue {
  title: string;
  labels: Label[];
}

export interface Status {
  name: string;
  issues: Issue[];
}

export interface Project {
  name: string;
  status: Status[];
}
