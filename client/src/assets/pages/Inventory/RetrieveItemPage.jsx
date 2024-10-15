import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import BackButton from '../../components/BackButton';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import backgroundImage from '../../images/t.png';

const RetrieveExistingInventory = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [retrieveAmount, setRetrieveAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:7788/inventory/${id}`, {
      params: {
        fields: ['Name', 'Quantity'].join(',')
      }
    })
      .then((response) => {
        const data = response.data;
        setName(data.Name);
        setQuantity(data.Quantity);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(`An error happened. Please check console`);
        console.log(error);
      });
  }, [id]);

  const handleRetrieve = () => {
    if (retrieveAmount > 0) {
      const updatedQuantity = parseInt(quantity) - retrieveAmount;
      if (updatedQuantity >= 0) {
        setQuantity(updatedQuantity);
        const data = {
          Quantity: updatedQuantity
        };
        axios
          .put(`http://localhost:7788/inventory/${id}`, data)
          .then(() => {
            setRetrieveAmount(0);
            // Display SweetAlert2 when item is successfully removed
            Swal.fire("Success!", "Item retrieved successfully!", "success");
          })
          .catch((error) => {
            alert('An error happened while updating quantity.');
            console.log(error);
          });
      } else {
        alert('Cannot retrieve more than current quantity.');
      }
    } else {
      alert('Please enter a valid retrieve amount.');
    }
  };

  const handleSave = () => {
    navigate(`/inventory/get/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      <div className="mr-[80%]"><BackButton destination={`/inventory/get/${id}`} />
      </div>
      {loading && <Spinner />}
      <form className=" rounded-3xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">View Inventory</h2>
        <div className="grid grid-cols-1 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="block w-full h-12 px-4 bg-gray-50 leading-7 text-base font-normal shadow border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
              placeholder="Name"
              value={name}
              readOnly
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
              Current Quantity
            </label>
            <input
              id="quantity"
              type="number"
              className="block w-full h-12 px-4 bg-gray-50 leading-7 text-base font-normal shadow border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
              placeholder="Quantity"
              value={quantity}
              readOnly
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock">
            Retrieve Amount
          </label>
          <input
            id="stock"
            type="number"
            className="block w-full h-12 px-5 bg-gray-50 leading-7 text-base font-normal shadow border border-gray-300 rounded-full focus:outline-none"
            placeholder="Stock"
            value={retrieveAmount}
            onChange={(e) => setRetrieveAmount(parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="w-1/2 h-12 px-4 mt-10 bg-green-600 hover:bg-green-800 transition-all duration-300 rounded-full shadow text-white text-base font-semibold leading-6 mr-2"
            onClick={handleRetrieve}
          >
             Retrieve
          </button>
          <button
            type="button"
            className="w-1/2 h-12 px-4 mt-10 bg-blue-600 hover:bg-blue-800 transition-all duration-300 rounded-full shadow text-white text-base font-semibold leading-6 ml-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};


export default RetrieveExistingInventory;