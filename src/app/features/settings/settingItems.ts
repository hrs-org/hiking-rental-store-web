import {
  Identifier,
  Section,
  SettingsOption,
} from '../../shared/components/settings-option/settings-option.component';

export const settingItems: SettingsOption[] = [
  {
    order: 1,
    identifier: Identifier.Profile,
    section: Section.Account,
    title: '',
    titleUppercase: true,
    desc: '',
    icon: 'person',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    order: 2,
    identifier: Identifier.EmployeeManagement,
    section: Section.Management,
    title: 'Employees',
    titleUppercase: false,
    desc: 'Employee management',
    icon: 'person',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    order: 3,
    identifier: Identifier.ItemManagement,
    section: Section.Management,
    title: 'Item Management',
    titleUppercase: false,
    desc: 'Manage items in the store',
    icon: 'person',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    order: 4,
    identifier: Identifier.Logout,
    section: Section.Settings,
    title: 'Logout',
    desc: 'We will miss you!',
    icon: 'logout',
    iconColor: 'red',
    onClick: () => {
      return;
    },
  },
  {
    order: 5,
    identifier: Identifier.TestPayment,
    section: Section.Settings,
    title: 'testPayment',
    desc: 'TESTTTT',
    icon: 'person',
    iconColor: 'blue',
    onClick: () => {
      return;
    },
  },
];
