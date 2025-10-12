import Customer from "../entity/customer";
import RepositoryInterface from "./repositoy-interface";

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> {}
