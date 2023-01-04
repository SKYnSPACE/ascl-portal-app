import { createContext, useState } from 'react';

const LocalDatabase = createContext();

const LocalDatabaseProvider = ({children}) => {

  const [user, setUser] = useState(
    {
      // isSignedIn: false,
      name: null,
      email: null,
      role: null,
      avatar: null,
    }
    // {
    // name: 'Seongheon Lee',
    // email: 'skynspace@kaist.ac.kr',
    // role: 'Senior Researcher',
    // avatar:
    //   'https://avatars.githubusercontent.com/u/21105393?v=4',
    // }
  );

  const data = {user,};
  const methods = {setUser,};

  return <LocalDatabase.Provider value={{ ...data, ...methods}}>{children}</LocalDatabase.Provider>
};

const LocalDatabaseConsumer = LocalDatabase.Consumer;

export {LocalDatabaseProvider, LocalDatabaseConsumer};
export default LocalDatabase;