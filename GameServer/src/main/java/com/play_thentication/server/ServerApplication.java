package com.play_thentication.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.file.Paths;

@SpringBootApplication
@RestController
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

    @GetMapping("/password")
    public String password() {
        String password = "";
        try {
            String path = Paths.get("src/main/resources/game/desktop-2.5.4.jar").toAbsolutePath().toString();
            ProcessBuilder pb = new ProcessBuilder("java", "-jar", path);
            Process process = pb.start();

            StringWriter outputWriter = new StringWriter();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    outputWriter.write(line);
                    outputWriter.write("\n");
                }
            }

            String output = outputWriter.toString();
            String[] parsedOutput = output.split("\n");
            for (String elem : parsedOutput) {
                if (elem.contains("PASSWORD")) {
                    password = elem.split("\t")[1];
                }
            }

            int exitCode = process.waitFor();
            System.out.println(exitCode);
        } catch (Exception e) {

        }
        return password;
    }
}
