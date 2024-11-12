export type ExampleData = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  role: string;
};

export type DefaultType = 'items' |'collections' | 'documents';

export type AlternateType = 'all' |'received' | 'sent';

export type dataUserProfileAllType<T = DefaultType | AlternateType> = {
  id: string;
  title: string;
  date: string;
  type: T;
}

export const data: ExampleData[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://example.com/avatars/alice.jpg",
    status: "online",
    role: "owner",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://example.com/avatars/bob.jpg",
    status: "offline",
    role: "banner",
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "https://example.com/avatars/charlie.jpg",
    status: "online",
    role: "member",
  },
  {
    id: "4",
    name: "Diana Prince",
    avatar: "https://example.com/avatars/diana.jpg",
    status: "online",
    role: "member",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    avatar: "https://example.com/avatars/ethan.jpg",
    status: "offline",
    role: "banner",
  },
  {
    id: "6",
    name: "Fiona Gallagher",
    avatar: "https://example.com/avatars/fiona.jpg",
    status: "online",
    role: "member",
  },
  {
    id: "7",
    name: "George Harrison",
    avatar: "https://example.com/avatars/george.jpg",
    status: "offline",
    role: "member",
  },
  {
    id: "8",
    name: "George Harrison",
    avatar: "https://example.com/avatars/george.jpg",
    status: "offline",
    role: "member",
  },
  {
    id: "9",
    name: "George Harrison",
    avatar: "https://example.com/avatars/george.jpg",
    status: "offline",
    role: "member",
  },
  {
    id: "10",
    name: "George Harrison",
    avatar: "https://example.com/avatars/george.jpg",
    status: "offline",
    role: "member",
  },
  {
    id: "11",
    name: "George Harrison",
    avatar: "https://example.com/avatars/george.jpg",
    status: "offline",
    role: "member",
  },
];

export const tabsHeaderDefault: DefaultType[] = ['items', 'collections', 'documents'];

export const tabsHeaderTransactions: AlternateType[] = ['all', 'received', 'sent'];

export const dataUserProfileAll: dataUserProfileAllType<DefaultType | AlternateType>[] = [
  { id: '1', title: 'Legal contract', date: '17.10.23', type: 'all' },
  { id: '2', title: 'Legal contract', date: '17.10.23', type: 'all' },
  { id: '3', title: 'Legal contract', date: '17.10.23', type: 'all' },
  { id: '4', title: 'Legal contract', date: '17.10.23', type: 'all' },
];