import React, { useState } from "react";
import userLayout from "../../layout/userLayout";
import ReactLoading from "react-loading";
import axiosApiInstance from "../../context/interceptor";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FaPen, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Progress, Modal, Input, Form, Select, Pagination } from "antd";

const BudgetPage = () => {
  const [load, setLoad] = useState(false);
  const [listBudget, setListBudget] = useState([]);
  const [listExpenseCategory, setListExpenseCategory] = useState([]);
  const [idCategory, setIdCategory] = useState();
  const [change, setChange] = useState(false);
  const [selectedBudget, setSelectedBuget] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [newBudget, setNewBudget] = useState({
    amount: "",
    description: "",
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchText(e.target.value);
    }
  };

  // phân trang
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (array, pageNumber, pageSize) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  };
  const currentBudgetList = paginate(listBudget, currentPage, pageSize);
  const handlePageChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
  };

  async function getBudget() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/budget/all`
    );
    setLoad(true);
    if (result?.data?.status === 101) {
      toast.success(result?.data?.message);
    } else {
      setListBudget(result?.data?.data);
    }
  }

  async function getExpenseUserCategory() {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/user-category/expense`
    );
    setLoad(true);
    if (result?.data?.status == 101) {
      setListExpenseCategory([]);
    } else {
      setListExpenseCategory(result?.data?.data);
    }
  }

  async function totalByUserCategory(idUserCategory) {
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/transaction/total/by/user-category/${idUserCategory}`
    );
    return result?.data?.data;
  }

  async function listBudgetSearch() {
    const encodedSearchText = encodeURIComponent(searchText);
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL +
        `/api/budget/search?user-category-name=${encodedSearchText}`
    );
    if (result?.data?.status === 101) {
      toast.error("Không có ngân sách cần tìm kiếm");
      setListBudget([]);
    } else {
      setListBudget(result?.data?.data);
    }
  }
  const [isModalAddBudget, setIsModalAddBudget] = useState(false);
  const [isModalUpdateBudget, setIsModalUpdateBudget] = useState(false);
  const [isModalDeleteBudget, setIsModalDeleteBudget] = useState(false);
  const [form] = Form.useForm();
  const openModalWithBudget = (item) => {
    setSelectedBuget(item);
    setIsModalUpdateBudget(true);
    form.setFieldsValue({
      amount: item?.amount,
      description: item?.description,
    });
  };

  const [form1] = Form.useForm();

  const handleCancel = () => {
    setIsModalAddBudget(false);
    setIsModalUpdateBudget(false);
    setIsModalDeleteBudget(false);
  };

  const handleChangeCategory = (event) => {
    setIdCategory(event);
  };

  const handleAddBudget = async () => {
    try {
      const result = await axiosApiInstance.post(
        axiosApiInstance.defaults.baseURL + `/api/budget/add/${idCategory}`,
        newBudget
      );
      if (result?.data?.status === 101) {
        toast.error(result?.data?.message);
        setIsModalAddBudget(false);
        form1.resetFields();
      } else {
        toast.success("Thêm ngân sách thành công!");
        setChange(!change);
        setIsModalAddBudget(false);
        form1.resetFields();
      }
    } catch (error) {
      toast.error("Có lỗi. Vui lòng thử lại");
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const payload = {
        amount: selectedBudget.amount,
        description: selectedBudget.description,
      };
      const result = await axiosApiInstance.put(
        axiosApiInstance.defaults.baseURL +
          `/api/budget/update/${selectedBudget?.id}`,
        payload
      );
      if (result?.data?.status === 101) {
        toast.error(result?.data?.message);
        setIsModalUpdateBudget(false);
      } else {
        toast.success("Sửa ngân sách thành công");
        setChange(!change);
        setIsModalUpdateBudget(false);
      }
    } catch (error) {
      toast.error("Có lỗi. Vui lòng thử lại!");
    }
  };

  async function deleteBudget() {
    try {
      const result = await axiosApiInstance.delete(
        axiosApiInstance.defaults.baseURL +
          `/api/budget/delete/${selectedBudget?.id}`
      );
      if (result?.data?.status === 200) {
        toast.success(result?.data?.message);
        setChange(!change);
        setIsModalDeleteBudget(false);
      } else {
        toast.error(result?.data?.message);
        setIsModalDeleteBudget(false);
      }
    } catch (error) {
      toast.error("Có lỗi. vui lòng thử lại");
    }
  }

  const [percentList, setPercentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePercentForAllItems = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const apiCalls = currentBudgetList.map((item) =>
        totalByUserCategory(item.userCategory.id)
      );
      const totals = await Promise.all(apiCalls);

      const newPercentList = totals.map((total, index) =>
        ((total / currentBudgetList[index].amount) * 100).toFixed(2)
      );
      setPercentList(newPercentList);
    } catch (error) {
      console.error("Error calculating percent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculatePercentForAllItems();
  }, [currentBudgetList, isLoading, load]);

  useEffect(() => {
    getBudget();
    getExpenseUserCategory();
  }, [load, change]);

  useEffect(() => {
    listBudgetSearch();
  }, [searchText]);

  return (
    <>
      {load ? (
        <div className="container py-5" style={{ minWidth: "95%" }}>
          <div className="justify-content-center">
            <div className="row">
              <div className="col text-left">
                <Input
                  style={{ width: "200px" }}
                  size="small"
                  placeholder="Tìm kiếm ngân sách"
                  prefix={<FaSearch />}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="col text-center">
                <h4 className="pb-2 mb-0">Ngân sách</h4>
              </div>
              <div className="col text-right">
                <button
                  className="btn btn-default low-height-btn"
                  title="Thêm"
                  onClick={() => {
                    setIsModalAddBudget(true);
                  }}
                >
                  Thêm <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="d-flex text-muted overflow-auto center">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="col-2 col-name">
                      Danh mục
                    </th>
                    <th scope="col" className="col-1 col-name">
                      Số tiền
                    </th>
                    <th scope="col" className="col-1 col-name">
                      Từ ngày
                    </th>
                    <th scope="col" className="col-1 col-name">
                      Đến ngày
                    </th>
                    <th scope="col" className="col-4 col-name">
                      Đã chi
                    </th>
                    <th scope="col" className="col-1 col-name">
                      Tác vụ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBudgetList.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.userCategory.name}</td>
                      <td>
                        {item.amount?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        {new Date(item.fromDate).toLocaleDateString("en-GB")}
                      </td>
                      <td>
                        {new Date(item.toDate).toLocaleDateString("en-GB")}
                      </td>
                      <td>
                        <Progress percent={percentList[index]}></Progress>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                          title="Chỉnh sửa"
                          id={item.id}
                          onClick={() => {
                            openModalWithBudget(item);
                          }}
                        >
                          <FaPen />
                        </button>
                        <button
                          type="button"
                          id={item.id}
                          className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                          title="Xóa"
                          onClick={() => {
                            setSelectedBuget(item);
                            setIsModalDeleteBudget(true);
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              onChange={handlePageChange}
              current={currentPage}
              pageSize={pageSize}
              total={listBudget.length}
            />
          </div>
        </div>
      ) : (
        <div className={"center loading"}>
          <ReactLoading
            type={"cylon"}
            color="#fffff"
            height={"33px"}
            width={"9%"}
          />
        </div>
      )}
      <Modal
        title={<div className="text-center">Thêm ngân sách mới</div>}
        open={isModalAddBudget}
        onOk={handleAddBudget}
        onCancel={handleCancel}
      >
        <Form form={form1} layout="vertical">
          <Form.Item name="category" label="Chọn loại danh mục">
            <Select onChange={handleChangeCategory}>
              {listExpenseCategory.map((category) => (
                <Select.Option key={category?.id} value={category?.id}>
                  {category?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Số tiền chi tiêu">
            <Input
              type="number"
              onChange={(e) =>
                setNewBudget({ ...newBudget, amount: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item name="description" label="Ghi chú">
            <Input
              type="text"
              onChange={(e) =>
                setNewBudget({ ...newBudget, description: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<div className="text-center">Sửa ngân sách</div>}
        open={isModalUpdateBudget}
        onOk={handleUpdateBudget}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="Số tiền chi tiêu">
            <Input
              type="number"
              onChange={(e) =>
                setSelectedBuget({ ...selectedBudget, amount: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item name="description" label="Ghi chú">
            <Input
              type="text"
              onChange={(e) =>
                setSelectedBuget({
                  ...selectedBudget,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<div className="text-center">Bạn có chắc muốn xóa danh mục</div>}
        open={isModalDeleteBudget}
        onOk={deleteBudget}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default userLayout(BudgetPage);
