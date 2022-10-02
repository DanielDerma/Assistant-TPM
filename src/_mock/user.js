import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  company: sample(['company', 'company2', 'company312341234']),
  area: sample(['area', 'area2', 'area3']),
  workspace: sample(['workspace', 'workspace2', 'workspace3']),
  system: sample(['system', 'system2', 'system3']),
  type: sample(['type', 'type2', 'type3']),
  date: sample(['12/12/2022']),
  status: sample(['status', 'status2', 'status3']),
}));

export default users;
