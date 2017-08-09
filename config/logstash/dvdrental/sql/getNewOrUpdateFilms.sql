SELECT film_id, title, description, release_year from film where last_update > :sql_last_value
