sqitch add 1.init_db -n "create domain, table and index"
sqitch add 2.add_constraint -n "Add constraint ON DELETE CASCADE on table user_has_family"
sqitch add 3.move_table_role -n "Move fkey role_id on table user_has_family"