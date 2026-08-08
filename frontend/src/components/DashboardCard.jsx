function DashboardCard(props) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow border-0 h-100">
        <div className="card-body text-center">

          <i
            className={props.icon}
            style={{ fontSize: "45px", color: "#0d6efd" }}
          ></i>

          <h5 className="mt-3">{props.title}</h5>

          <p className="text-muted">{props.description}</p>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard;