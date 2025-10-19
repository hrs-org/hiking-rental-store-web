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
    identifier: Identifier.StoreProfile,
    section: Section.Account,
    title: 'Store',
    titleUppercase: false,
    desc: 'Store profile',
    icon: 'store',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    order: 3,
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
    order: 4,
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
    order: 5,
    identifier: Identifier.ItemMaintenance,
    section: Section.Management,
    title: 'Item Maintenance',
    titleUppercase: false,
    desc: 'Maintenance items in the store',
    icon: 'person',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    order: 6,
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
];
