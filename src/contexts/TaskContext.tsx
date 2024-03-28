import { ReactNode, createContext, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import { Task } from "../types/Task";
import moment from "moment";

type TaskContextProps = {
  taskList: Task[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: string;
  formatedToday: string;
  taskInput: string;
  setTaskInput: (value: string) => void;
  setCategoryValue: React.Dispatch<React.SetStateAction<null>>;
  categoryValue: string | null;
  handleAddTask: () => void;
  handleSelectCategory: (type: string) => void;
  handleRemoveTask: (id: number) => void;
  handleDoneTask: (id: number) => void;
  db: SQLite.SQLiteDatabase;
  getTasks: () => Promise<void>;
  dateInput: Date;
  setDateInput: (value: Date) => void;
  getTasksByDate: (date: string) => void;
  pickImage: (id: number) => void;
  takePhoto: (id: number) => void;
  image: string[];
  setImage: (value: string[]) => void;
  getTasksById: (id: number) => void;
  taskSelected: string;
};

type TaskProviderProps = {
  children: ReactNode;
};

export const TaskContext = createContext<TaskContextProps>(
  {} as TaskContextProps
);

export const TaskContextProvider = ({ children }: TaskProviderProps) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const formatedToday = moment().format("DD/MM/YYYY");
  const [dateInput, setDateInput] = useState(new Date());
  const [dateSelected, setDateSelected] = useState("");
  const [taskSelected, setTaskSelected] = useState("");
  const [image, setImage] = useState<string[]>([]);

  const openDatabase = () => {
    const db = SQLite.openDatabase("db.db");
    return db;
  };

  const db = openDatabase();

  const getTasks = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const getTasksById = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where id = ?;`,
        [id],
        (_, { rows: { _array } }) => {
          setTaskSelected(_array[0].images);
        }
      );
    });
  };

  const getTasksByCategory = (category: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 0 and category = ? and date = ?;`,
        [category, dateSelected],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const getTasksByDate = (date: string) => {
    setDateSelected(date);
    const query =
      categoryValue === "all"
        ? `select * from tasks where completed = 0 and date = ?;`
        : `select * from tasks where completed = 0 and date = ? and category = ?;`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        selectedCategory === "all" ? [date] : [date, selectedCategory],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const getCompletedTasks = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from tasks where completed = 1;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleAddTask = async () => {
    if (taskInput !== "" && categoryValue) {
      db.transaction((tx) => {
        tx.executeSql(
          "insert into tasks (completed, title, category, date, images) values (0, ?, ?, ?, '')",
          [taskInput, categoryValue, moment(dateInput).format("YYYY-MM-DD")]
        );
        tx.executeSql(
          `select * from tasks where completed = 0;`,
          [],
          (_, { rows: { _array } }) => {
            setTaskList(_array);
          }
        );
      });
    }

    setTaskInput("");
    setCategoryValue(null);
  };

  const handleRemoveTask = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("delete from tasks where id = ?", [id]);
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleDoneTask = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("update tasks set completed = ? where id = ? ", [1, id]);
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleSelectCategory = (type: string) => {
    setSelectedCategory(type);
    switch (type) {
      case "all":
        getTasks();
        break;
      case "done":
        getCompletedTasks();
        break;
      default:
        getTasksByCategory(type);
    }
  };

  const handleAddImage = async (file: string[], id: number) => {
    db.transaction((tx) => {
      tx.executeSql("update tasks set images = ? where id = ?;", [
        file.toString(),
        id,
      ]);
      tx.executeSql(
        `select * from tasks where completed = 0;`,
        [],
        (_, { rows: { _array } }) => {
          setTaskList(_array);
        }
      );
    });
  };

  const handleImage = (file: string, id: number) => {
    let newImages = [...image];
    newImages.push(file);
    setImage(newImages);
    handleAddImage(newImages, id);
  };

  const pickImage = async (id: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [16, 9],
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      handleImage(result.assets[0].base64, id);
    }
  };

  const takePhoto = async (id: number) => {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [16, 9],
      base64: true,
    });

    if (!data.canceled && data.assets[0].base64) {
      handleImage(data.assets[0].base64, id);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        taskList,
        open,
        setOpen,
        selectedCategory,
        formatedToday,
        taskInput,
        setTaskInput,
        setCategoryValue,
        categoryValue,
        handleAddTask,
        handleSelectCategory,
        handleRemoveTask,
        handleDoneTask,
        db,
        getTasks,
        dateInput,
        setDateInput,
        getTasksByDate,
        pickImage,
        takePhoto,
        image,
        setImage,
        getTasksById,
        taskSelected,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
