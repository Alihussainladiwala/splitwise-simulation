/* eslint-disable react/jsx-filename-extension */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Select from 'react-select';
import './AddGroups.css';
const queryString = require('query-string');
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import endPointObj from '../../endPointUrl';
import { getAllUsers } from '../../GraphQL/Query';
import { useMutation, useQuery } from '@apollo/client';
import { createGroupRequest } from '../../GraphQL/Mutations';

function Groups() {
  const [createGp, { createGroupError }] = useMutation(createGroupRequest);
  const { error, loading, data } = useQuery(getAllUsers);
  const history = useHistory();
  const parsed = queryString.parse(location.search);
  let email = parsed;
  const [form, setForm] = useState([]);
  const [group, setGroup] = useState('');
  const [flag, setFlag] = useState(false);
  const [user, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [alert, setAlert] = useState([]);
  const [count, setCount] = useState(0);
  const [emailId, setEmail] = useState([email.email]);

  const handleClickDashboard = () => {
    history.push({
      pathname: '/dashboard',
      search: '?email=' + emailId,
    });
  };

  const dashboard = () => {
    handleClickDashboard();
  };

  useEffect(() => {
    //   Axios.get(endPointObj.url + 'allUsers')
    //     .then((response) => {
    //       // eslint-disable-next-line no-console
    //       // setUsers(response.data);

    //       let data = [];

    //       response.data.forEach((ele) => {
    //         console.log(ele);

    //         data.push({
    //           label: ele.username + ' ( ' + ele.email + ' )',
    //           value: ele.email,
    //         });
    //         setUsers(data);
    //       });
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });

    let result = [];
    if (data) {
      console.log(data);
      data.getAllUsers.forEach((ele) => {
        result.push({
          label: ele.username + ' ( ' + ele.email + ' )',
          value: ele.email,
        });
      });
      console.log(result);
      setUsers(result);
    }
  }, [data]);

  const onSubmit = (e) => {
    let finalMembers = [];
    finalMembers = members.map((member) => member.value);

    if (group.length == 0) {
      setAlert('Please provide a group Name');
    } else if (finalMembers.length == 0) {
      setAlert('Please add members');
    } else {
      e.preventDefault();
      createGp({
        variables: {
          groupName: group,
          user: emailId[0],
          members: finalMembers,
        },
      }).then((result) => {
        console.log(result);
        console.log('successfully created group');
        if (result.data && result.data.createGroup.message == 'group already exists') {
          setAlert(result.data.createGroup.message);
        } else {
          dashboard();
        }
      });
    }
    // e.preventDefault();
    // let finalMembers = [];
    // finalMembers = members.map((member) => member.value);
    // if (group.length == 0) {
    //   setAlert('Please provide a group Name');
    // } else if (finalMembers.length == 0) {
    //   setAlert('Please add members');
    // } else {
    //   Axios.post(endPointObj.url + 'createGroup', {
    //     groupName: group,
    //     user: emailId,
    //     members: finalMembers,
    //   })
    //     .then((response) => {
    //       // eslint-disable-next-line no-console
    //       console.log(response);
    //       // setUsers(response.data);
    //       dashboard();
    //     })
    //     .catch((e) => {
    //       if (e.response && e.response.data) {
    //         console.log(e.response.data.message); // some reason error message
    //         setAlert(e.response.data.message);
    //       }
    //     });
    // }
  };
  const onChange = (opt) => {
    if (opt == null || opt == 'undefined') {
      opt = '';
    }
    setMembers((prev) => [...opt]);
    console.log(members);
  };

  return (
    <div className="container mt-5 ">
      <h1>Add Groups</h1>
      <p>Add Members</p>

      <form>
        <div className="row mt-3">
          <div className="col">
            <input
              type="text"
              className={flag ? 'form-control  is-invalid' : 'form-control'}
              placeholder="group"
              onChange={(e) => {
                setGroup(e.target.value);
              }}
            />
            {flag && <div className="invalid-feedback">group is required</div>}
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <Select onChange={(opt) => onChange(opt)} options={user} isMulti />
          </div>
        </div>

        <button className="btn btn-primary mt-2" onClick={onSubmit}>
          Create
        </button>

        {alert.length > 0 && (
          <Alert className="alert" key="0" variant="danger">
            {alert}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default Groups;
