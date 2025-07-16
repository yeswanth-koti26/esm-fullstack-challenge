import pandas as pd
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from esm_fullstack_challenge.db import DB, query_builder
from esm_fullstack_challenge.dependencies import get_db, CommonQueryParams
from esm_fullstack_challenge.models import AutoGenModels

Driver = AutoGenModels["drivers"]
Result = AutoGenModels["results"]

dashboard_router = APIRouter()


@dashboard_router.get("/top_drivers_by_wins")
def get_top_drivers_by_wins(
    cqp: CommonQueryParams = Depends(CommonQueryParams),
    db: DB = Depends(get_db)
) -> list:
    """Gets top drivers by wins."""
    base_query_str = (
        "with driver_wins as (\n"
        "    select d.id,\n"
        "        d.forename || ' ' || d.surname as full_name,\n"
        "        d.nationality,\n"
        "        d.dob,\n"
        "        date() - date(dob)             as age,\n"
        "        d.url\n"
        "    from drivers d\n"
        "          join results r on d.id = r.driver_id\n"
        "          join status s on r.status_id = s.id\n"
        "    where s.status = 'Finished'\n"
        "    and r.position_order = 1\n"
        ")\n"
        "select\n"
        "    *,\n"
        "    count(*) as number_of_wins\n"
        "from driver_wins"
    )
    query_str = query_builder(
        custom_select=base_query_str,
        order_by=cqp.order_by or [('number_of_wins', 'desc')],
        limit=cqp.limit,
        offset=cqp.offset,
        filter_by=cqp.filter_by,
        group_by=['id', 'full_name', 'nationality', 'dob', 'age', 'url']
    )
    with db.get_connection() as conn:
        df = pd.read_sql_query(query_str, conn)
        drivers = list(df.to_dict(orient='records'))

    return drivers


@dashboard_router.get("/races_per_year")
def get_races_per_year(db: DB = Depends(get_db)) -> list:
    """Returns number of races per year."""
    query = """
        SELECT year, COUNT(*) as race_count
        FROM races
        GROUP BY year
        ORDER BY year ASC
    """
    with db.get_connection() as conn:
        df = pd.read_sql_query(query, conn)
        return df.to_dict(orient='records')


@dashboard_router.get("/wins_per_nationality")
def get_wins_per_nationality(db: DB = Depends(get_db)) -> list:
    """Returns total driver wins grouped by nationality."""
    query = """
        SELECT d.nationality, COUNT(*) as total_wins
        FROM results r
        JOIN drivers d ON d.id = r.driver_id
        WHERE r.position = 1
        GROUP BY d.nationality
        ORDER BY total_wins DESC
    """
    with db.get_connection() as conn:
        df = pd.read_sql_query(query, conn)
        return df.to_dict(orient="records")
@dashboard_router.get("/pole_positions_per_driver")
def pole_positions_per_driver(db: Session = Depends(get_db)):
    results = db.query(DriverRef.forename, DriverRef.surname, func.count(Qualifying.position).label("pole_count"))\
                .join(Qualifying, DriverRef.driver_ref == Qualifying.driver_ref)\
                .filter(Qualifying.position == 1)\
                .group_by(DriverRef.driver_ref)\
                .order_by(func.count(Qualifying.position).desc())\
                .limit(20)\
                .all()

    return [
        {
            "driver": f"{row.forename} {row.surname}",
            "pole_count": row.pole_count
        } for row in results
    ]
