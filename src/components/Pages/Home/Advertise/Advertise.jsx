import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";
import { AuthProvider } from "../../../../UserContext/UserContext";
import BookNow from "../../BookNow/BookNow";
import "../Categories/Categories.css";

const axiosSecure = axios.create({
  baseURL: "http://localhost:4030",
});

const Advertise = () => {
  const { currentUser } = useContext(AuthProvider);

  const [bookingData, setBookingData] = useState({});
  const [closeModal, setCloseModal] = useState(true);
  const [sellerInfo, setSellerInfo] = useState([]);

  // Attach JWT Token
  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("pc-shop-only");

        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Advertised Products
  const { data: advertiseItems = [], isLoading } = useQuery({
    queryKey: ["advertiseItems"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertiseItems");
      return res.data;
    },
  });

  // Get All Users
  useEffect(() => {
    if (!currentUser?.email) return;

    axiosSecure
      .get("/users")
      .then((res) => {
        setSellerInfo(res.data);
      })
      .catch((err) => {
        console.log(err.response);

        if (err.response?.status === 401) {
          toast.error("Unauthorized");
        } else if (err.response?.status === 403) {
          toast.error("Forbidden! Buyer account required.");
        } else {
          toast.error(err.message);
        }
      });
  }, [currentUser]);

  const handleBookingData = (product) => {
    setBookingData(product);
    setCloseModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#DE1068" />
      </div>
    );
  }

  return (
    <>
      {advertiseItems.length > 0 && (
        <>
          <div className="my-12">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4">

              {advertiseItems.map((advertise) => {

                const seller = sellerInfo.find(
                  (user) => user.email === advertise.sellerEmail
                );

                return (
                  <div
                    key={advertise._id}
                    className="card card-compact shadow-xl"
                  >
                    <figure>
                      <img
                        src={advertise.productImage}
                        alt={advertise.productName}
                      />
                    </figure>

                    <div className="card-body">

                      <h2 className="card-title">
                        {advertise.productName}
                      </h2>

                      <p>{advertise.description}</p>

                      <p>Price : ${advertise.ProductPrice}</p>

                      <p>Seller : {advertise.sellerName}</p>

                      <p>Email : {advertise.sellerEmail}</p>

                      <p>Phone : {advertise.phoneNumber}</p>

                      <div className="flex items-center gap-2">

                        <img
                          src={advertise.sellerProfile}
                          alt=""
                          className="w-12 h-12 rounded-full"
                        />

                        {seller?.isSellerVerified ? (
                          <>
                            <span>Verified</span>

                            <TiTick className="text-blue-600 text-xl" />
                          </>
                        ) : (
                          <span>Unverified</span>
                        )}
                      </div>

                      <div className="card-actions justify-end">

                        {currentUser?.role === "Buyer" &&
                          advertise.product !== "sold" && (
                            <label
                              htmlFor="bookingModal"
                              className="btn btn-primary"
                              onClick={() => handleBookingData(advertise)}
                            >
                              Book Now
                              <BsArrowRight className="ml-2" />
                            </label>
                          )}

                        {advertise.product === "sold" && (
                          <button
                            className="btn btn-success"
                            disabled
                          >
                            Already Sold
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!closeModal && (
            <BookNow
              modalData={bookingData}
              setCloseModale={setCloseModal}
            />
          )}
        </>
      )}
    </>
  );
};

export default Advertise;