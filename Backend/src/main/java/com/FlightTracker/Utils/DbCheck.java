package com.FlightTracker.Utils;

import javax.sql.DataSource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DbCheck implements CommandLineRunner {

    private final DataSource dataSource;

    public DbCheck(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DB URL: " + dataSource.getConnection().getMetaData().getURL());
    }
}
