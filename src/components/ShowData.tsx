import React,{useState} from 'react';
import { Splitter, Flex } from 'antd';
import StudentForm from './StudentForm';
import DataCard from './DataCard';


const ShowData = () => {
 const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(prev => !prev);
  return (
    <>
    <Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
    <Splitter.Panel defaultSize="60%" min="20%" max="70%">
        {/* <Flex justify='center' style={{width:"500px"}}><StudentForm onStudentAdded={triggerRefresh}/></Flex> */}
        <StudentForm onStudentAdded={triggerRefresh}/>
    </Splitter.Panel>
    <Splitter.Panel>
      <DataCard refresh={refresh}/>
    </Splitter.Panel>
  </Splitter>
    </>
  )
}

export default ShowData
