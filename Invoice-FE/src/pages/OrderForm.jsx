import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    product: '',
    rate: '',
    unit: '',
    quantity: '',
    discount: '',
    netAmount: '',
    totalAmount: ''
  });

  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const savedOrderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    setOrderItems(savedOrderItems);
  }, []);

  useEffect(() => {
    const selectedProduct = products.find(p => p._id === formData.product);
    if (selectedProduct) {
      setFormData({
        ...formData,
        rate: selectedProduct.Rate,
        unit: selectedProduct.Unit,
      });
    }
  }, [formData.product, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateTotal = () => {
    const { rate, unit, quantity, discount } = formData;

    const rateValue = parseFloat(rate) || 0;
    const unitValue = parseFloat(unit) || 0;
    const quantityValue = parseFloat(quantity) || 0;
    const discountValue = parseFloat(discount) || 0;

    const netAmount = rateValue * unitValue * quantityValue;
    const discountAmount = (netAmount * discountValue) / 100;
    const totalAmount = netAmount - discountAmount;

    setFormData({
      ...formData,
      netAmount: netAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  const handleAddItem = () => {
    const selectedProduct = products.find(p => p._id === formData.product);
    if (!selectedProduct) return;

    const newItem = {
      product: selectedProduct._id,
      rate: formData.rate,
      unit: formData.unit,
      quantity: formData.quantity,
      discount: formData.discount,
      netAmount: formData.netAmount,
      totalAmount: formData.totalAmount
    };

    const updatedOrderItems = [...orderItems, newItem];
    setOrderItems(updatedOrderItems);
    localStorage.setItem('orderItems', JSON.stringify(updatedOrderItems));

    setFormData({
      customerName: formData.customerName,
      product: '',
      rate: '',
      unit: '',
      quantity: '',
      discount: '',
      netAmount: '',
      totalAmount: ''
    });

    setIsModalOpen(true);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
    localStorage.setItem('orderItems', JSON.stringify(updatedItems));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceMaster = {
      invoiceNo: generateInvoiceNo(),
      invoiceDate: new Date(),
      customerName: formData.customerName,
      totalAmount: orderItems.reduce((acc, item) => acc + parseFloat(item.totalAmount), 0)
    };

    const invoiceDetail = orderItems.map(item => ({
      invoiceId: invoiceMaster.invoiceNo,
      productId: item.product,
      rate: item.rate,
      unit: item.unit,
      qty: item.quantity,
      discount: item.discount,
      netAmount: item.netAmount,
      totalAmount: item.totalAmount
    }));

    try {
      const response = await fetch(`http://localhost:3000/api/saveInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceMaster, invoiceDetail })
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Invoice saved successfully!');
        console.log('Invoice saved:', result);
        setIsModalOpen(false); 
      } else {
        toast.error('Failed to save invoice. Please try again.');
      }
      setIsModalOpen(false); 
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const generateInvoiceNo = () => {
    return Math.floor(Math.random() * 1000000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
            <select
              id="product"
              name="product"
              value={formData.product._id}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">Select a Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.Product_Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

          <div>
            <label htmlFor="netAmount" className="block text-sm font-medium text-gray-700">Net Amount</label>
            <input
              type="text"
              id="netAmount"
              name="netAmount"
              value={formData.netAmount}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="text"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="button"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={calculateTotal}
          >
            Calculate
          </button>
          <button
            type="button"
            className="ml-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Rate</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.product}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{item.rate}</td>
                    <td className="px-4 py-2">{item.totalAmount}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleSubmit}
              >
                Submit Order
              </button>
            </div>
            <div className="mt-4 text-right">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;

